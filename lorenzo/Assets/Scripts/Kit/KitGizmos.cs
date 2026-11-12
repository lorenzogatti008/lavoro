// ============================================================
//  ZONE NELLA SCENE VIEW (KitGizmos)
//  Disegna le zone invisibili come box colorati nella Scene view: azzurro per le trigger, giallo per le piastre, verde per la zona finale.
//
//  DOVE SI METTE
//    Non si aggiunge a niente: lo usano le zone del kit.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Niente da configurare.
//
//  COME SI COLLEGA
//    Niente da collegare.
//
//  ESEMPIO
//    I box si vedono solo nell'editor, non nel gioco.
// ============================================================
using UnityEngine;

/// <summary>Disegna nella Scene view le zone trigger del kit, cosi' si vedono anche se sono invisibili.</summary>
public static class KitGizmos
{
    public static void DrawZone(Collider c, Color color)
    {
        if (c is BoxCollider box)
        {
            Gizmos.matrix = box.transform.localToWorldMatrix;
            Gizmos.color = color; Gizmos.DrawCube(box.center, box.size);
            color.a = 1f; Gizmos.color = color; Gizmos.DrawWireCube(box.center, box.size);
            Gizmos.matrix = Matrix4x4.identity;
        }
        else if (c is SphereCollider sphere)
        {
            var center = sphere.transform.TransformPoint(sphere.center);
            var s = sphere.transform.lossyScale; float r = sphere.radius * Mathf.Max(s.x, Mathf.Max(s.y, s.z));
            color.a = 1f; Gizmos.color = color; Gizmos.DrawWireSphere(center, r);
        }
    }
}
